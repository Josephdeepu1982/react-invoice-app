import React, { useState } from "react";
const InvoiceTable = (props) => {
  const [comments, setComments] = useState({});

  //name of engineer is used as key & comment is the comment entered for the engineer (handleChange("Bob", "Approved");
  //Copies all existing key-value pairs from previousComment.
  //[name] tells JavaScript to use the value of the variable name as the key in the object. comment is the value assigned to that key.

  const handleChange = (name, comment) => {
    setComments({ ...comments, [name]: comment });
  };

  //handleSave() is triggered when the "Save with comments" button is clicked.
  //props.data is an array of objects. each object is a row of engineer data from app.jsx. We use .map() to loop through each engineer data in data prop and uses the spread operator ...row to copy all properties of the current row into a new object.
  //comment: comments[row.name] || '' : It adds a new property comment to each row.
  // comments[row.name] is a dynamic key access. It tells JS to look inside the comments object and fetch the value associated with the key that matches row.name
  // since we don't know the names of the engineers ahead of time (they come from props.data, which could change), we use dynamic property access on the comments object.It tries to get a comment from the comments object using the row.name as the key. If the comments state has a comment for that engineer's name, it uses that. If not, it defaults to an empty string ('').
  //it calls onSave() which is passed on as a prop with the updated data that now includes comments
  const handleSave = () => {
    const dataWithComments = props.data.map((row) => ({
      ...row,
      comment: comments[row.name] || "Pending Approval",
    }));
    props.onSave(dataWithComments);
  };

  return (
    <div>
      <table border="1">
        <thead>
          <tr>
            <th>Engineer</th>
            <th>Vendor</th>
            <th>Month</th>
            <th>Rate</th>
            <th>Days Worked</th>
            <th>Workdays</th>
            <th>Amount</th>
            <th>Comment</th>
          </tr>
        </thead>

        <tbody>
          {props.data.map((engineer, index) => {
            return (
              <tr key={index}>
                <td>{engineer.name}</td>
                <td>{engineer.vendor}</td>
                <td>{engineer.month}</td>
                <td>{engineer.rate}</td>
                <td>{engineer.daysWorked}</td>
                <td>{engineer.workdays}</td>
                <td>{engineer.amount}</td>
                <td>
                  <input
                    type="text"
                    placeholder="Pending Approval"
                    value={comments[engineer.name] || ""}
                    onChange={(event) => {
                      handleChange(engineer.name, event.target.value);
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={handleSave}>Save with Comments</button>
    </div>
  );
};

export default InvoiceTable;
