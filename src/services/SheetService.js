const BASE_URL = "https://api.airtable.com/v0/appdKU7gOYZ5LoKt9";
const ATTENDANCE_TABLE = "tblAM4TYxSj3tcNpf";
const INVOICE_TABLE = "tbl4eNbCJfvdnpUon"; // Created a new table for invoices
const API_KEY =
  "patWmODcgVKigyRDV.7c472fe0d3b7631d4e7b5f41ddbe194ced1d114187f4a5202cd85357c579e257";

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

//fetch() the dropdown options (years, months and company) via Attendance table airtable
// As drop down values are to be unique, we use a set object to collect unique values for years (2023..), months (jan,feb..) and companies (Govtech..)
//The Airtable API always returns a JSON object with a top-level property called "records". We can use array.forEach() to update the sets with unique values.
//convert Sets to arrays to be used as dropdown <select>
const fetchDropdownOptions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/${ATTENDANCE_TABLE}`, {
      headers,
    });
    const data = await response.json();

    const years = new Set();
    const months = new Set();
    const companies = new Set();

    data.records.forEach((record) => {
      if (record.fields.Year) {
        years.add(record.fields.Year);
      }
      if (record.fields.Month) {
        months.add(record.fields.Month);
      }
      if (record.fields.Company) {
        companies.add(record.fields.Company);
      }
    });

    return {
      years: [...years],
      months: [...months],
      companies: [...companies],
    };
  } catch (error) {
    console.log("Error fetching dropdowns:", error);
  }
};

//fetch() the filtered invoice data based on filters.
// Takes filteroptions (year,month,company, name) as parameter from App.jsx when the function fetchinvoiceData() is called
//Return filtered data using records.filter():- filters each record to match our selected filters: Ensures that records retrurned match selected month, year, and company.If a name is provided, it must also match the Name.
// We then use filtered.map to transform each filtered record into a new object with only the info we want (rates, daysWorked and workdays).If a value is missing (undefined), use a fallback: Rate → 0 or DaysWorked → 0 Workdays → 1 (avoids division by 0)
//amount is computed using our formula and rounded to 2 decimal places using .toFixed(2).

const fetchInvoiceData = async (filteroptions) => {
  try {
    const response = await fetch(`${BASE_URL}/${ATTENDANCE_TABLE}`, {
      headers,
    });
    const data = await response.json();

    const filtered = data.records.filter((record) => {
      return (
        record.fields.Month === filteroptions.month &&
        record.fields.Year === filteroptions.year &&
        record.fields.Company === filteroptions.company &&
        (!filteroptions.name || record.fields.Name === filteroptions.name)
      );
    });

    return filtered.map((record) => {
      const rate = parseFloat((record.fields.Monthly_Rate || 0).toFixed(2));
      const daysWorked = record.fields.Month_Work_Days || 0;
      const workdays = record.fields.Workdays || 1;

      return {
        name: record.fields.Name,
        vendor: record.fields.Company,
        month: record.fields.Month,
        year: record.fields.Year,
        rate: rate, //from filtered.map()
        daysWorked: daysWorked, //from filtered.map()
        workdays: workdays, //from filtered.map()
        amount: ((rate / workdays) * daysWorked).toFixed(2),
      };
    });
  } catch (err) {
    console.log("Error fetching invoice data:", err);
  }
};

//Save invoice data into new INVOICE_TABLE Airtable with comments
//invoiceData is an array of invoice objects. It is generated when we call fetchInvoiceData(filters) above. Passed into saveInvoiceData(invoiceData) to be saved to Airtable.
//Create a records object in the format Airtable expects to be POST into Airtable. invoiceData.map converts each item in invoiceData to an object with the fields corresponding to the column names
const saveInvoiceData = async (invoiceData) => {
  const payload = {
    records: invoiceData.map((item) => ({
      fields: {
        Name: item.name,
        Vendor: item.vendor,
        Month: item.month,
        Rate: item.rate,
        DaysWorked: item.daysWorked,
        Workdays: item.workdays,
        Amount: parseFloat(item.amount), //converts string to number : "0.00" to 0.00 (number)
        Comment: item.comment || "",
      },
    })),
  };
  console.log(
    "Payload being sent to Airtable:",
    JSON.stringify(payload, null, 2)
  );
  try {
    const result = await fetch(`${BASE_URL}/${INVOICE_TABLE}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await result.json();
    return data;
  } catch (error) {
    console.log("Error saving invoice data:", error);
  }
};

const fetchAllInvoices = async () => {
  try {
    const response = await fetch(`${BASE_URL}/${INVOICE_TABLE}`, { headers });
    const data = await response.json();

    return data.records.map((record) => ({
      id: record.id,
      name: record.fields.Name,
      vendor: record.fields.Vendor,
      month: record.fields.Month,
      rate: record.fields.Rate,
      daysWorked: record.fields.DaysWorked,
      workdays: record.fields.Workdays,
      amount: record.fields.Amount,
      comment: record.fields.Comment || "",
    }));
  } catch (error) {
    console.log("Error fetching all Invoice Data", error);
  }
};

const deleteInvoice = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${INVOICE_TABLE}/${id}`, {
      method: "DELETE",
      headers,
    });
  } catch (error) {
    console.log("Error Deleting Invoice", error);
  }
};

const updateInvoiceAmount = async (id, newAmount) => {
  try {
    const response = await fetch(`${BASE_URL}/${INVOICE_TABLE}/${id}`, {
      method: "PATCH", //Airtable uses PATCH for updates
      headers,
      body: JSON.stringify({
        fields: {
          Amount: parseFloat(newAmount),
        },
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating invoice amount:", error);
  }
};

export {
  fetchDropdownOptions,
  fetchInvoiceData,
  saveInvoiceData,
  fetchAllInvoices,
  deleteInvoice,
  updateInvoiceAmount,
};

//JSON.stringify(payload, null, 2): This converts the payload JavaScript object into a pretty-printed JSON string:
// payload: the object you're sending to Airtable.
// null: means no custom replacer function is used.
// 2: means indent the output with 2 spaces for readability.
