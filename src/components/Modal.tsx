import React, { FC, ReactNode } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  title: string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ title, children, open, onClose }) => {
  if (!open) return null;

  const handleBackdropKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      onClose();
    }
  };

  return (
    <div className="modal-wrapper">
      <div
        className="backdrop"
        onClick={onClose}
        onKeyDown={handleBackdropKeyDown}
        tabIndex={0}
        aria-hidden="true"
      ></div>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal__header">
          <h2 id="modal-title" className="title">
            {title}
          </h2>
          <button onClick={onClose} type="button" aria-label="Close modal">
            <XCircleIcon className="icon close" />
          </button>
        </div>
        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
