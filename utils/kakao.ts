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
        // Next.js API route를 통해 요청 (CORS 문제 해결)
        const response = await fetch("/api/alimtalk", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                phone,
                email,
                notes,
                selectedProducts,
                selectedFrame,
                framePrice,
                total
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API 응답 데이터:", JSON.stringify(result, null, 2));

        if (!result.success) {
            throw new Error(result.error || "알림톡 전송 실패");
        }

        return { success: true, data: result.data };
    } catch (error: any) {
        console.error("알림톡 전송 중 오류:", error);
        return { success: false, error: error.message };
    }
}