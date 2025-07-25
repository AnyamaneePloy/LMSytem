export default function ClosedCasesTable({ cases, onSelect }) {
  return (
    <table className="table-auto w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">Case No</th>
          <th className="border px-2 py-1">Client</th>
          <th className="border px-2 py-1">Type</th>
          <th className="border px-2 py-1">Closed Date</th>
          <th className="border px-2 py-1">Action</th>
        </tr>
      </thead>
      <tbody>
        {cases.map((c) => (
          <tr key={c.caseId}>
            <td className="border px-2">{c.caseNumber}</td>
            <td className="border px-2">{c.clientName}</td>
            <td className="border px-2">{c.caseType}</td>
            <td className="border px-2">{c.closedDate}</td>
            <td className="border px-2">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => onSelect(c)}
              >
                Reopen
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
