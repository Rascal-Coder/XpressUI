import { Modal } from "@repo/modal";
import type { CodePanelDialogProps, } from "#/types";
import CodePanel from "./code-panel";

export function CodePanelDialog({
  open,
  onOpenChange,
  themeEditorState,
}: CodePanelDialogProps) {
  return (
    <Modal
      modal={true}
      isOpen={open}
      overlayBlur={2}
      setIsOpen={onOpenChange}
      showClose={true}
      modalClass="h-[80vh] gap-6 overflow-hidden rounded-lg border p-0 py-6 shadow-lg"
      showConfirmButton={false}
      showCancelButton={false}
      draggable={true}
      title="Theme Code"
    >
      <div className="h-full overflow-auto px-6">
        <CodePanel themeEditorState={themeEditorState} />
      </div>
    </Modal>
  );
}
