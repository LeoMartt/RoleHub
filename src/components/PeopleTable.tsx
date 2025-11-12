import { useMemo, useState } from "react";
import type { User } from "../types";

type Props = {
  users: User[];
  pageSize?: number;
};

function Avatar({ user }: { user: User }) {
  const initials =
    user.fullName?.trim().split(/\s+/).slice(0,2).map(p => p[0]?.toUpperCase()).join("") || "US";

  return user.avatarUrl ? (
    <img src={user.avatarUrl} alt={user.fullName} className="rounded-circle" style={{width:28,height:28,objectFit:"cover"}} />
  ) : (
    <div
      className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
      style={{width:28,height:28,fontSize:12}}
    >
      {initials}
    </div>
  );
}

export default function PeopleTable({ users, pageSize = 10 }: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));

  const slice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, page, pageSize]);

  const prev = () => setPage(p => Math.max(1, p - 1));
  const next = () => setPage(p => Math.min(totalPages, p + 1));

  return (
    <div className="card shadow-sm rounded-4 border-0">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead>
              <tr className="text-body-secondary">
                <th style={{width:60}}>Foto</th>
                <th>Nome</th>
              </tr>
            </thead>
            <tbody>
              {slice.map(u => (
                <tr key={String(u.id)}>
                  <td className="py-3"><Avatar user={u} /></td>
                  <td className="py-3">{u.fullName}</td>
                </tr>
              ))}
              {slice.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center text-body-secondary py-4">Nenhum interessado ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end align-items-center gap-2 p-3 border-top">
          <button className="btn btn-sm btn-light" onClick={prev} disabled={page === 1}>Anterior</button>
          <span className="badge bg-success-subtle text-success-emphasis">{page}</span>
          <button className="btn btn-sm btn-light" onClick={next} disabled={page === totalPages}>Próxima</button>
        </div>
      </div>
    </div>
  );
}
