import React, { useState } from "react";
import "./Calendar.css";

function Calendar({ year, month, menus, setMenus }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function getFirstDayOfMonth() {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 7 : firstDay;
  }

  const monthOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthTime = monthOfYear[new Date().getMonth()];

  function getDaysInMonth() {
    return new Date(year, month + 1, 0).getDate();
  }

  const firstDayOfMonth = getFirstDayOfMonth();
  const daysInMonth = getDaysInMonth();
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const days = [];

  for (let i = 1; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  function delMenu(menuToDelete) {
    const newMenusList = menus.filter((menu) => menu !== menuToDelete);
    setMenus(newMenusList);
    setIsModalOpen(false);
  }

  function showMeal(day, menus, monthTime) {
    const menuForDay = menus.filter(
      (menu) => day === parseInt(menu.date.slice(-2).trim())
    );

    if (menuForDay.length > 0) {
      return menuForDay.map((menu, index) => (
        <div key={index}>
          {menu.veggie ? "You have a veggie" : "You have"} {menu.menuName}{" "}
          planned on the {day} of {monthTime}.
          <br />
          You'll need: {menu.ingredients}. <br />
          You planned {menu.prepTime} min on this.
          <br />
          <button className="modal-button" onClick={() => delMenu(menu)}>
            Delete this menu
          </button>
          <br />
        </div>
      ));
    }

    return (
      <>
        Nothing planned yet on the {day} of {monthTime}.
      </>
    );
  }

  function hasMenu(day, menus) {
    return menus.some((menu) => {
      const menuDate = new Date(menu.date);
      const menuDay = menuDate.getDate();
      const menuMonth = menuDate.getMonth();
      const menuYear = menuDate.getFullYear();

      return day === menuDay && month === menuMonth && year === menuYear;
    });
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => (
          <div key={index} className="calendar-day">
            {day ? (
              <>
                <button
                  className={hasMenu(day, menus) ? "has-menu" : ""}
                  onClick={() => {
                    setSelectedDay(day);
                    setIsModalOpen(true);
                  }}
                >
                  {day}
                </button>
                {isModalOpen && selectedDay === day && (
                  <div
                    id="myModal"
                    className="modal"
                    style={{ display: "block" }}
                  >
                    <div className="modal-content">
                      <span
                        className="close"
                        onClick={() => setIsModalOpen(false)}
                      >
                        &times;
                      </span>
                      <p>{showMeal(selectedDay, menus, monthTime)}</p>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
