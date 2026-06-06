/**
 * SportIcon — renders either an emoji or an <img> depending on the icon value.
 * If icon starts with "/" or "http" it's treated as an image URL.
 * Otherwise it's rendered as an emoji/text character.
 */
export default function SportIcon({ icon, size = '1em', style = {} }) {
  if (!icon) return null;
  const isImage = icon.startsWith('/') || icon.startsWith('http');
  if (isImage) {
    return (
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        style={{
          width: size, height: size,
          objectFit: 'contain', display: 'inline-block',
          verticalAlign: 'middle', flexShrink: 0,
          ...style,
        }}
      />
    );
  }
  return <span aria-hidden="true" style={{ fontSize: size, lineHeight: 1, ...style }}>{icon}</span>;
}
