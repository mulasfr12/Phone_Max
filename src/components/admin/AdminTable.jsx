export default function AdminTable({ columns, rows, renderActions }) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm shadow-zinc-950/5">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100 text-left text-sm">
          <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-4 py-4">
                  {column.label}
                </th>
              ))}
              {renderActions && (
                <th scope="col" className="px-4 py-4">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((row) => (
              <tr key={row.id} className="align-top">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 text-zinc-700">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-4 py-4">{renderActions(row)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
