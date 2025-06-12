import { useEffect } from "react";
import { useState } from "react";
import SearchBar from "./components/SearchBar";
import InvoiceTable from "./components/InvoiceTable";
import {
  fetchDropdownOptions,
  fetchInvoiceData,
  saveInvoiceData,
} from "./services/SheetService";
import { Route, Routes } from "react-router";
import AllInvoicesPage from "./components/AllInvoicesPage";
import { Link } from "react-router";

const App = () => {
  const [dropdowns, setDropdowns] = useState({
    years: [],
    months: [],
    companies: [],
  });
  const [invoiceData, setInvoiceData] = useState([]);

  // useEffect runs once when the component mounts and defines an async function to fetch dropdown options

  useEffect(() => {
    const loadDropDowns = async () => {
      try {
        const dropdownOptions = await fetchDropdownOptions(); //Fetches dropdown data
        setDropdowns(dropdownOptions);
      } catch (error) {
        console.error("Failed to load dropDown options:", error);
      }
    };
    loadDropDowns(); // Call the function
  }, []); // Empty dependency array means this runs only once

  //onSearchSubmit() prop : This function is called when the user submits the search form. It sends the selected values (year, month, company, name) back to App.jsx to fetch invoice data.
  const handleSearchSubmit = async (searchQuery) => {
    try {
      const data = await fetchInvoiceData(searchQuery); // Fetch invoice data based on search
      setInvoiceData(data); // Update state with fetched invoice data
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };

  //Function to handle saving invoice data
  const handleSave = async (dataWithComments) => {
    try {
      await saveInvoiceData(dataWithComments); // Save data with comments to second Airtable
      alert("Invoice data saved to Airtable with comments!");
    } catch (error) {
      console.error("Error Saving Invoice Data:", error);
      alert("Failed to save Invoice Data");
    }
  };

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/invoices">View All Invoices</Link>
      </nav>
      <h1>Engineer Invoice Generator</h1>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SearchBar
                dropdowns={dropdowns}
                onSearchSubmit={handleSearchSubmit}
              />
              <InvoiceTable data={invoiceData} onSave={handleSave} />
            </>
          }
        />
        <Route path="/invoices" element={<AllInvoicesPage />} />
      </Routes>
    </div>
  );
};

export default App;
