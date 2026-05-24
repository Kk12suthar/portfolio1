import { footerConfig } from '../config';

export default function Footer() {
  if (!footerConfig.copyrightText && !footerConfig.statusText) {
    return null;
  }

  return (
    <footer className="luxury-footer">
      <span className="footer-copy">
        {footerConfig.copyrightText}
      </span>
      <span className="footer-status">
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#000000',
            display: 'inline-block',
            boxShadow: '0 0 6px rgba(0, 0, 0, 0.4)',
          }}
        />
        {footerConfig.statusText}
      </span>
    </footer>
  );
}
