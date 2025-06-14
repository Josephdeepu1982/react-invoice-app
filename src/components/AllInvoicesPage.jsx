import { useEffect } from "react";
import { useState } from "react";
import {
  deleteInvoice,
  fetchAllInvoices,
  updateInvoiceAmount,
} from "../services/SheetService";

const AllInvoicesPage = () => {
  const [invoices, setInvoices] = useState([]); //Store all invoices
  const [editedAmounts, setEditedAmounts] = useState({}); //Save edited amt

  useEffect(() => {
    const getInvoices = async () => {
      try {
        const result = await fetchAllInvoices();
        setInvoices(result);
      } catch (error) {
        console.log("Error fetching Invoices", error);
      }
    };
    getInvoices();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this invoice?");
    if (confirmDelete) {
      try {
        await deleteInvoice(id); //call API to delete from Airtable

        const updatedList = await fetchAllInvoices(); //re-fetch all invoices after deletion
        setInvoices(updatedList);

        alert("Invoice Deleted");
      } catch (error) {
        console.log("Error Deleting Invoice", error);
        alert("Failed to delete invoice");
      }
    }
  };

  // When the input changes, update the editedAmounts state. The app keeps a temporary record of what the user is editing.
  const handleAmountChange = (id, value) => {
    setEditedAmounts({
      ...editedAmounts,
      [id]: value,
    });
  };

  //when Save is clicked, save the new amt
  const handleAmountUpdate = async (id) => {
    const newAmount = editedAmounts[id];

    if (!newAmount) return;

    try {
      await updateInvoiceAmount(id, newAmount);
      alert("Amount updated!");

      //refersh the invoice list
      const updatedList = await fetchAllInvoices();
      setInvoices(updatedList);
      // Clear the edited amount from state
      //After we edit something and clicked save, it updates Airtable.
      // As we don't want the app to think it's still being edited, we remove that invoice's id from the editedAmounts object. This clears the edited value from temporary state.
      const updatedEditedAmounts = { ...editedAmounts };
      delete updatedEditedAmounts[id];
      setEditedAmounts(updatedEditedAmounts);
    } catch (error) {
      alert("Failed to update amount");
    }
  };

  return (
    <div>
      <h2> All Invoices </h2>

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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => {
            return (
              <tr key={invoice.id}>
                <td>{invoice.name}</td>
                <td>{invoice.vendor}</td>
                <td>{invoice.month}</td>
                <td>{invoice.rate}</td>
                <td>{invoice.daysWorked}</td>
                <td>{invoice.workdays}</td>

                <td>
                  <input
                    type="number"
                    value={editedAmounts[invoice.id] ?? invoice.amount}
                    onChange={(e) =>
                      handleAmountChange(invoice.id, e.target.value)
                    }
                  />
                  <button onClick={() => handleAmountUpdate(invoice.id)}>
                    Save
                  </button>
                </td>

                <td>{invoice.comment}</td>
                <td>
                  <button
                    onClick={() => {
                      handleDelete(invoice.id);
                    }}
                  >
                    Delete Row
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AllInvoicesPage;
