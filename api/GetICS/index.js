const fetch = require('node-fetch');
// const setTZ = require('set-tz');
const fns = require('date-fns-tz');
const ics = require('ics');

// Convert JavaScript Date to array of integers
function dateToArray(date) {
    return [date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
}

const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const tz = 'Australia/Sydney';

module.exports = async function (context, req) {
    const codes = Object.keys(req.query);
    if (codes.length === 0 || typeof Intl !== 'object') {
        context.res = {
            status: 404,
            body: "Please provide a course code in the query parameter (eg COMP2310)"
        };
        context.done();
    }

    let data = await fetch('https://raw.githubusercontent.com/pl4nty/anutimetable/master/public/timetable.json').then(res => res.json())
    const events = [];
    // hardcode timezone (timezones are hard and it's 11:30pm mkay)
    // Azure SWA blocks WEBSITE_TIME_ZONE in its Function runtime :(
    for (let module of codes) {
        const course = data[module];
        
        if (course) {
            let selected = {}
            req.query[module].split(',').forEach(x => {
                const parts = x.split(' ');
                selected[parts[0]] = parts[1];
            });

            for (let session of course.classes) {
                if (!selected[session.activity] || selected[session.activity] === session.occurrence) {
                    const currentYear = (fns.zonedTimeToUtc(new Date(), {timeZone: tz})).getFullYear();
                    
                    // Days from start of year until first Monday - aka Week 0
                    // modulo 7 in case start of year is a Monday
                    let d = new Date(currentYear, 0, 0);
                    d = fns.zonedTimeToUtc(d, { timeZone: tz });
                    d.setDate(d.getDate() + ((7-d.getDay())%7+1) % 7 + 2);
                    const dayDiff = d.getDay() % 7;

                    // repeated weeks are stored as "31\u201136,39\u201144"
                    for (let weeks of session.weeks.split(',')) {
                        const interval = weeks.split('\u2011')
                        const day = dayDiff + 7*(interval[0]-1) + parseInt(session.day) - 6

                        let start = fns.zonedTimeToUtc(new Date(currentYear, 0, day, ...session.start.split(':')), {timeZone: tz});
                        // start = fns.toDate(start, { timeZone: tz });
                        const weekday = days[start.getUTCDay()]
                        start = dateToArray(start);

                        let end = fns.zonedTimeToUtc(new Date(currentYear, 0, day, ...session.finish.split(':')), {timeZone: tz});
                        console.log(end)
                        // end = fns.toDate(end, { timeZone: tz });
                        end = dateToArray(end)

                        events.push({
                            start,
                            end,
                            title: `${session.module} ${session.activity} ${parseInt(session.occurrence)}`,
                            description: `${session.activity} ${parseInt(session.occurrence)}`,
                            location: session.location,
                            url: session.locationID,
                            productId: 'anucssa/timetable',
                            uid: session.name+weeks,
                            recurrenceRule: `FREQ=WEEKLY;BYDAY=${weekday};INTERVAL=1;COUNT=${interval[interval.length-1]-interval[0]+1}`,
                            calName: `ANU Timetable ${currentYear} ${session.session}`
                        })
                    }
                }
            }
        }
    }

    const { value, error } = ics.createEvents(events)
    context.res = {
        status: 200,
        headers: {'Content-Type': 'text/calendar'},
        body: value
    };
    context.done();
};