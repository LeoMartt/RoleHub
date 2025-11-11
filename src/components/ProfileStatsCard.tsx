type Props = {
  createdCount: number;
  participatedCount: number;
};

export default function ProfileStatsCard({ createdCount, participatedCount }: Props) {
  return (
    <div className="card shadow-sm rounded-4 border-0">
      <div className="card-body p-4">
        <h6 className="fw-semibold mb-3">Estatísticas</h6>

        <div className="d-flex justify-content-between align-items-center py-2">
          <span className="text-body">Eventos criados</span>
          <span className="count-pill">{createdCount}</span>
        </div>

        <div className="d-flex justify-content-between align-items-center py-2 border-top">
          <span className="text-body">Eventos participados</span>
          <span className="count-pill">{participatedCount}</span>
        </div>
      </div>
    </div>
  );
}
