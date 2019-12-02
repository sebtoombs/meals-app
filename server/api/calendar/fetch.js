const db = require("../../../db/dynamodb");
const { format, parse } = require("date-fns");
const to = require("../../../utils/to");

module.exports = async ctx => {
  const [calendarsPkErr, userCalendars] = await to(
    db.query.getCalendarsByUserPk("User:dd02b620-13cc-11ea-9a01-c7d125d3a832")
  );

  if (calendarsPkErr) {
    console.log("Error", calendarsErr);
    ctx.status = 500;
    ctx.body = calendarsErr;
    return;
  }

  const calendarPks = userCalendars.map(userCalendar => userCalendar.sk);

  const [calendarsErr, calendars] = await to(
    db.query.getCalendarByPk(calendarPks, "Calendar")
  );

  const calendarsWithEntries = await Promise.all(
    calendars.map(async calendar => {
      const [entriesErr, entries] = await to(
        db.query.getEntriesByCalendarPk(calendar.pk)
      );
      if (entriesErr) {
        calendar.entries = entriesErr;
        return calendar; //TODO maybe return an object?
      }
      calendar.entries = entries;
      return calendar;
    })
  );

  console.log(calendarsWithEntries);

  return (ctx.body = { calendar: [] });
};
