import React from 'react';

function formatCurrency(value) {
  const digits = `${value}`.replace(/\D/g, '');
  const number = (parseInt(digits || '0', 10) / 100).toFixed(2);
  return number.replace('.', ',');
}

export function parseCurrencyToNumber(masked) {
  if (!masked) return 0;
  const normalized = `${masked}`.replace(/\./g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function CurrencyInput({ label, name, value, onValueChange, placeholder }) {
  const handleChange = (e) => {
    const formatted = formatCurrency(e.target.value);
    onValueChange(formatted);
  };

  return (
    <div>
      {label && (
        <label className="text-sm text-soft" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        inputMode="numeric"
        className="input-base mt-1"
        aria-label={label || name}
        placeholder={placeholder || '0,00'}
        value={value}
        onChange={handleChange}
      />
      <p className="text-xs text-soft mt-1" role="note">
        Digite apenas números; a vírgula é posicionada automaticamente para reais e centavos.
      </p>
    </div>
  );
}
