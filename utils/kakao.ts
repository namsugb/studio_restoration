interface SubmitAlimtalkToStudioProps {

    name: string;
    phone: string;
    email: string;
    notes: string;
    selectedProducts: string[];
    selectedFrame: string;
    framePrice: number;
    total: number;
}

export const submitAlimtalkToStudio = async (props: SubmitAlimtalkToStudioProps) => {
    const { name, phone, email, notes, selectedProducts, selectedFrame, framePrice, total } = props;

    try {
        // Lunasoft API 설정 확인
        const LUNA_API_KEY = "4UR1KDVQBF8JF91EI7BMI8KDZFSE9WBB9787J5OW"
        const LUNA_USERID = "skatmdtn0310"
        const LUNA_TEMPLATE_CODE = 50080;

        if (!LUNA_USERID || !LUNA_API_KEY || !LUNA_TEMPLATE_CODE) {
            console.warn("Lunasoft 알림톡 설정이 되어있지 않습니다.");
            return { success: false, error: "Lunasoft configuration missing" };
        }

        const phoneNumber = phone.replace(/-/g, '');
        const studio = "아침햇살 스튜디오";

        const requestBody = {
            userid: LUNA_USERID,
            api_key: LUNA_API_KEY,
            template_id: LUNA_TEMPLATE_CODE,
            messages: [
                {
                    no: "1",
                    tel_num: "01050040036",
                    use_sms: "0",
                    sms_content: "아침햇살 스튜디오 예약 문의",
                    msg_content: `${studio} 님 복원작업 문의가 있습니다.\n성함: ${name}\n연락처: ${phone}\n이메일: ${email}\n요청사항: ${notes}\n선택상품: ${selectedProducts}\n선택액자: ${selectedFrame}\n총 금액: ${total}`
                },
            ],
        }



        console.log("API 요청 데이터:", JSON.stringify(requestBody, null, 2));

        // Lunasoft API 요청
        const response = await fetch("https://jupiter.lunasoft.co.kr/api/AlimTalk/message/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API 응답 데이터:", JSON.stringify(result, null, 2));

        // Lunasoft API 응답 처리
        if (result.code !== 0) {
            const errorMessage = typeof result.msg === 'object'
                ? JSON.stringify(result.msg, null, 2)
                : result.msg || "알림톡 전송 실패";
            throw new Error(errorMessage);
        }

        return { success: true, data: result };
    } catch (error: any) {
        console.error("알림톡 전송 중 오류:", error);
        return { success: false, error: error.message };
    }
}