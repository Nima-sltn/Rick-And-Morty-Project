import { XCircleIcon } from "@heroicons/react/24/outline";

function Modal({ title, children, onOpen, open }) {
  if (!open) return null;
  return (
    <div>
      <div
        className="backdrop"
        onClick={() => onOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onOpen(false);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close backdrop"></div>

      <div className="modal">
        <div className="modal__header">
          <h2 className="title">{title}</h2>
          <button onClick={() => onOpen(false)}>
            <XCircleIcon className="icon close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
