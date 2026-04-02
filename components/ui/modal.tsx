"use client";

import { useEffect, useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  // Create modal container if it doesn't exist
  useEffect(() => {
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      const root = document.createElement('div');
      root.id = 'modal-root';
      root.style.position = 'fixed';
      root.style.inset = '0';
      root.style.zIndex = '999999';
      document.body.appendChild(root);
      return () => {
        document.body.removeChild(root);
      };
    }
  }, []);

  const modalRoot = typeof document !== 'undefined' ? document.getElementById('modal-root') : null;

  if (!modalRoot) return null;

  // Create portal container for this specific modal
  const portalContainer = document.createElement('div');
  portalContainer.style.position = 'fixed';
  portalContainer.style.inset = '0';
  portalContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
  portalContainer.style.display = 'flex';
  portalContainer.style.alignItems = 'center';
  portalContainer.style.justifyContent = 'center';
  portalContainer.style.zIndex = '999999';
  portalContainer.style.padding = '16px';

  const content = (
    <div 
      style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        width: '100%',
        maxWidth: '448px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );

  portalContainer.appendChild(content as unknown as Node);
  portalContainer.onclick = onClose;
  document.body.appendChild(portalContainer);

  return null;
}
