export function onChangeInputNumber(
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (value: number | '') => void,
) {
  let raw = e.target.value;

  if (/^0\d+/.test(raw)) {
    raw = raw.replace(/^0+/, '');
  }

  if (raw === '') {
    onChange('');
  } else {
    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) {
      onChange(parsed);
    }
  }
}
