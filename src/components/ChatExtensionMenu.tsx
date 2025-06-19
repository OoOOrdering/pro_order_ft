"use client"
import Button from "./Button"

interface ChatExtensionMenuProps {
  isOpen: boolean
  onClose: () => void
  onPresetMessage: (message: string) => void
  onImageUpload: () => void
  onPaymentRequest: () => void
  presetMessages: string[]
  isVendor?: boolean
}

export default function ChatExtensionMenu({
  isOpen,
  onClose,
  onPresetMessage,
  onImageUpload,
  onPaymentRequest,
  presetMessages,
  isVendor,
}: ChatExtensionMenuProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Menu */}
      <div className="absolute bottom-full right-0 mb-2 w-80 bg-card border rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-2">
        <div className="p-4 space-y-4">
          {/* Preset Messages */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">자주 쓰는 메시지</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {presetMessages.map((message, index) => (
                <button
                  key={index}
                  onClick={() => onPresetMessage(message)}
                  className="w-full text-left p-2 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 border-t pt-4">
            <Button variant="outline" size="sm" onClick={onImageUpload} className="w-full justify-start">
              📷 이미지 전송
            </Button>

            {isVendor && (
              <Button variant="outline" size="sm" onClick={onPaymentRequest} className="w-full justify-start">
                💳 결제 요청
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
