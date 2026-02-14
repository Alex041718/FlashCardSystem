import './KpiCard.scss';

interface KpiCardProps {
  label: string;
  value: number;
  icon?: string;
}

const KpiCard = ({ label, value, icon }: KpiCardProps) => {
  return (
    <div className="kpi-card">
      <div className="kpi-card__content">
        {icon && <div className="kpi-card__icon">{icon}</div>}
        <div className="kpi-card__info">
          <div className="kpi-card__value">{value}</div>
          <div className="kpi-card__label">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
