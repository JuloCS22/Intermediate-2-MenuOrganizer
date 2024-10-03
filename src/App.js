import "./styles.css";
import { useState, useEffect } from "react";
import Calendar from "./Calendar";

export default function App() {
  const [ingredientsList, setIngredientsList] = useState([]);
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
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const [formData, setFormData] = useState({
    menuName: "",
    ingredients: "",
    date: "",
    veggie: false,
    prepTime: "15",
  });

  const [menus, setMenus] = useState(() => {
    const savedMenus = localStorage.getItem("menus");
    try {
      return savedMenus ? JSON.parse(savedMenus) : [];
    } catch (error) {
      console.error("Error parsing saved habits from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("menus", JSON.stringify(menus));
    let ingredients = [];
    menus.forEach((menu) => {
      ingredients = ingredients.concat(menu.ingredients.split(","));
    });

    let ingredientCount = {};
    ingredients.forEach((ingredient) => {
      ingredient = ingredient.trim();
      if (ingredientCount[ingredient]) {
        ingredientCount[ingredient]++;
      } else {
        ingredientCount[ingredient] = 1;
      }
    });

    let result = [];
    for (let ingredient in ingredientCount) {
      result.push(` ${ingredient} :  ${ingredientCount[ingredient]}`);
    }
    setIngredientsList(result.sort());
  }, [menus]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.menuName || !formData.ingredients || formData.date === "") {
      alert(
        "You forgot to put ingredients, a menu name or a date to your meal!"
      );
    } else if (menus.some((menu) => menu.date === formData.date)) {
      alert("You already have a meal on this date, fatty");
      setFormData({
        menuName: "",
        ingredients: "",
        date: "",
        veggie: false,
        prepTime: "15",
      });
    } else {
      setMenus((prevMenus) => [...prevMenus, formData]);
      setFormData({
        menuName: "",
        ingredients: "",
        date: "",
        veggie: false,
        prepTime: "15",
      });
    }
  }

  function clearAll() {
    setMenus([]);
  }

  function copyList(text) {
    navigator.clipboard.writeText(text).then(
      () => {
        alert("Grocery list copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy: ", err);
      }
    );
  }

  function delIngredient(index) {
    const newIngredientsList = ingredientsList.filter((_, i) => i !== index);
    setIngredientsList(newIngredientsList);
  }

  function changeMonth(i) {
    if (month + i > 11) {
      setMonth(0);
      setYear(year + 1);
    } else if (month + i < 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month + i);
    }
  }

  return (
    <div>
      <h1>MenuOrganizer</h1>
      <h2>V 2.0</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="menuName"
            className="form-input"
            placeholder="Menu name"
            value={formData.menuName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="ingredients"
            className="form-input form-ingredients"
            placeholder="Ingredients"
            value={formData.ingredients}
            onChange={handleChange}
          />
          <input
            type="date"
            name="date"
            className="form-input"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="line-input">
          <label>
            <input
              type="checkbox"
              name="veggie"
              className="form-input veggie-input"
              checked={formData.veggie}
              onChange={handleChange}
            />
            Veggie
          </label>

          <label>
            <select
              name="prepTime"
              id="prep-time"
              className="form-input"
              value={formData.prepTime}
              onChange={handleChange}
            >
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">1h +</option>
            </select>
          </label>
        </div>

        <div className="add-button">
          <button className="add-button" type="submit">
            Add meal
          </button>
        </div>
      </form>

      <Calendar year={year} month={month} menus={menus} setMenus={setMenus} />
      <div className="calendarTitle">
        {monthOfYear[month]} - {year}
        <div>
          <button className="bottom-button" onClick={() => changeMonth(-1)}>
            Previous month
          </button>
          <button className="bottom-button" onClick={() => changeMonth(1)}>
            Next month
          </button>
        </div>
      </div>

      <div className="grocery-list">
        <h3>GroceryList:</h3>
        <ul>
          {ingredientsList.map((ingredient, index) => (
            <li key={index}>
              {ingredient}
              <button
                className="delIngredient"
                onClick={() => delIngredient(index)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        className="copyButton"
        onClick={() =>
          copyList(
            ingredientsList.map((ingredient) => `- ${ingredient}`).join("\n")
          )
        }
      >
        Copy list
      </button>
      <button className="clearButton" onClick={clearAll}>
        Clear EVERYTHING
      </button>
    </div>
  );
}
