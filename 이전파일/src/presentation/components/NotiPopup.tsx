import { PhoneOff, AlertCircle, Clock, X } from "lucide-react";

interface NotiPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotiPopup({ isOpen, onClose }: NotiPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50"></div>
              <div className="relative bg-red-50 rounded-full p-6">
                <PhoneOff className="w-16 h-16 text-red-500" />
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full mb-6">
            <Clock className="w-4 h-4" />
            <span>복구 중</span>
          </div>

          {/* Main Message */}
          <h1 className="text-gray-900 mb-3">
            전화 상담 서버 장애로 인한
            <br />
            복구 중입니다
          </h1>

          {/* Apology Message */}
          <p className="text-gray-600 mb-8">
            불편을 드려 죄송합니다
          </p>

          {/* Divider */}
          <div className="border-t border-gray-100 pt-6">
            {/* Additional Info */}
            <div className="flex items-start gap-3 text-left bg-blue-50 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-900 mb-1">서비스 복구 안내</p>
                <p className="text-blue-700 text-sm">
                  최대한 빠른 시일 내에 정상화하도록 노력하겠습니다.
                  서비스 이용에 불편을 드려 대단히 죄송합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>문의사항은 이메일로 연락 부탁드립니다</p>
        </div>
      </div>
    </div>
  );
}