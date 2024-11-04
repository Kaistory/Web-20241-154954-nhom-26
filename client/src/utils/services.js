export const baseUrl = "http://localhost:8000/api";

export const postRequest = async (url, body) => {
    // Ensure the body is a JSON string
    const jsonBody = JSON.stringify(body);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonBody, // Use the JSON string here
        });

        const data = await response.json();

        if (!response.ok) {
            let message;

            // Log the response data for debugging
            console.error("Error response:", data);

            if (data?.message) {
                message = data.message;
            } else {
                message = data;
            }
            return { error: true, message };
        }
        
        return data;
    } catch (error) {
        // Catch network errors or other unexpected errors
        console.error("Request failed:", error);
        return { error: true, message: "An unexpected error occurred." };
    }
};