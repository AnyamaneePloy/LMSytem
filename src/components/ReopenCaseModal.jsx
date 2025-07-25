import React, { useEffect, useState } from 'react';
import { getClosedCases, submitReopenCase } from '../api/admin';

export default function ReopenCaseAdmin() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getClosedCases().then(setCases).catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (!reason || !comment.trim()) {
      setMessage({ type: 'error', text: 'Please fill in both reason and comment.' });
      return;
    }

    try {
      await submitReopenCase({
        caseId: selectedCase.caseId,
        reopenReason: reason,
        comment: comment,
        assignedTo: '', // Optional
        notifyStakeholders: true,
        attachments: [],
      });
      setMessage({ type: 'success', text: '✅ Case reopened successfully.' });
      setSelectedCase(null);
      setReason('');
      setComment('');
      getClosedCases().then(setCases); // Refresh
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🧑‍⚖️ Reopen Closed Legal Cases</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <table className="table-auto w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2">Case No</th>
            <th className="border px-2">Client</th>
            <th className="border px-2">Type</th>
            <th className="border px-2">Closed</th>
            <th className="border px-2">Action</th>
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
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => {
                    setSelectedCase(c);
                    setReason('');
                    setComment('');
                    setMessage(null);
                  }}
                >
                  Reopen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reopen Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-[400px] rounded shadow">
            <h3 className="font-semibold mb-2">
              Reopen Case: {selectedCase.caseNumber}
            </h3>

            <label>Reason</label>
            <select className="w-full mb-3 border" value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">-- Select --</option>
              <option value="New Evidence">New Evidence</option>
              <option value="Mistaken Closure">Mistaken Closure</option>
              <option value="Other">Other</option>
            </select>

            <label>Comment</label>
            <textarea
              className="w-full mb-4 border"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedCase(null)} className="border px-4 py-1 rounded">
                Cancel
              </button>
              <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-1 rounded">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
