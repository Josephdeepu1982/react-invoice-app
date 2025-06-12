import React, { useState } from "react";
const SearchBar = (props) => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");

  //onSearchSubmit() is passed in as a prop to the component. It sends an object containing the current values of: month, year, company & name to app.jsx
  const handleSubmit = (event) => {
    event.preventDefault();

    const filters = {
      month: month,
      year: year,
      company: company,
      name: name,
    };

    props.onSearchSubmit(filters);
  };

  //We Use the actual value (year) as the key is preferred because: It helps React track changes more accurately and avoids bugs when the list is reordered, filtered, or updated dynamically.
  // <option key={year}>{year}</option>
  // <option key="2023">2023</option>
  // <option key="2024">2024</option>
  // <option key="2025">2025</option>

  //<option value="">Year</option>: This is a placeholder option. It shows "Year" in the dropdown when nothing is selected. value="" means that if nothing is selected, the year state will be an empty string.
  //{props.dropdowns.year.map((year) : dynamic options that loops through the props.dropdowns to create dropdown options.
  // //Example : props. dropdowns.companies = ["GovTech", "TechCorp", "InnoSoft"] then dropdown will be ▼ Company -> GovTech-> TechCorp -> InnoSoft. When the user selects "TechCorp", the company state becomes "TechCorp".

  return (
    <>
      <form onSubmit={handleSubmit}>
        <select
          value={year}
          onChange={(event) => {
            setYear(event.target.value);
          }}
        >
          <option value="">Year</option>
          {props.dropdowns.years.map((year) => {
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>

        <select
          value={month}
          onChange={(event) => {
            setMonth(event.target.value);
          }}
        >
          <option value="">Month</option>
          {props.dropdowns.months.map((month) => {
            return (
              <option key={month} value={month}>
                {month}
              </option>
            );
          })}
        </select>

        <select
          value={company}
          onChange={(event) => {
            setCompany(event.target.value);
          }}
        >
          <option value="">Company</option>
          {props.dropdowns.companies.map((company) => {
            return (
              <option key={company} value={company}>
                {company}
              </option>
            );
          })}
        </select>

        <input
          type="text"
          placeholder="Engineer's Name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />

        <button type="submit">Search</button>
      </form>
    </>
  );
};

export default SearchBar;
