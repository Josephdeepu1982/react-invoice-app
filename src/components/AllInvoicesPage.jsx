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

  const handleAmountUpdate = async (id) => {
    const newAmount = editedAmounts[id];
    if (!newAmount) return;

    try {
      await updateInvoiceAmount(id, newAmount);
      alert("Amount updated!");
      //refersh the list
      const updatedList = await fetchAllInvoices();
      setInvoices(updatedList);

      setEditedAmounts((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      alert("Failed to update amount");
    }
  };

  const handleAmountChange = (id, value) => {
    setEditedAmounts((prev) => ({ ...prev, [id]: value }));
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
