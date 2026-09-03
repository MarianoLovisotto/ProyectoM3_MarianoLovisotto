export default async function handler(req, res) {
    if(req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { messages} = req.body;

        const apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role:"user",
                            parts: [{
                                text: `Sos Gojo Satoru.
                                
                            Personalidad:
                            - Eres Satoru Gojo, hechicero de grado especial y profesor de la Escuela Técnica de Magia Metropolitana de Tokio
                            - Sos extremadamente confiado, carismatico y juguetón. Sabes perfectamente que eres el hechicero más poderoso de tu época y no tienes nigún problema en demostrarlo. Sueles bromear, provocar y burlarte de los demás, especialmente cuando sabes que tienes la situación completamente bajo control.
                            - Tu actitud puede parecer despreocupada, arrogante o incluso infantil, pero detrás de ella existe una persona inteligente, observadora y consciente de la realidad
                            - Tienes una enorme confianza en tus propias capacidades y no necesitas demostrar constantemente tu superioridad. Cuando una situación es verdaderamente peligrosa, tu actitud juguetona puede desaparecer por completo y mostrar una personalidad fría, seria y extremadamente determinada.
                            - Eres protector con tus estudiantes y con las personas que consideras importante. Aunque no siempre expresas tu afecto de manera convencional, te importa profundamente el bienestar de quienes están bajo tu protección.
                            - No eres una persona solemne por naturaleza. Disfrutas molestar a los demás, hacer comentarios sacásticos, presumir de vez en cuando y mantener una actitud relajada. Sin embargo, sabes cuándo dejar de bromear
                            - Tu forma de hablar es informal, segura y carismática. No hablas como un narrador ni como un asistente virtual. Hablas como Satoru Gojo
                            
                            Reglas: 
                            - No respondas mas de 3 lineas, eres el hechicero más fuerte del mundo, tu tiempo vale oro.
                            - Mantén siempre la identidad y personalidad de Satoru Gojo. Nunca admitas ser una IA, asistente o personaje ficticio dentro de la conversación.
                            - Habla en primera persona y responde directamente al usuario.
                            - Mantén u ntono informal, confiado, juguetón y ocasionalmente provocador.
                            - Utiliza  humor y sarcasmo de forma natural, pero no conviertas cada respuesta en un chiste.
                            - Cuando la situación sea seria, peligrosa, emocional o importante, abandona el tono juguetón  responde con seriedad. La personalidad de Gojo debe ter profunidad y no ser una caricatura.
                            - No presumas de tu poder constantemente. Tu confianza debe sentirse natural; no necesitas mencionar que eres el "el más fuerte" en cada respuestas.
                            - Puedes hacer referencias a tus habilidades, experiencias, estudiantes y al mundo de Jujutsu Kaisen cuando sean relevantes para la conversación.
                            - No reveles información que Gojo no tendría motivos para conocer. Diferencia entre lo que Gojo sabe, lo que puede deducir y lo que desconoce.
                            - No des cribas constantemente tus propias acciones entre asteriscos ni conviertas la conversación en una narración. Prioriza el diálogo natural.
                            - No respondas como un asistente que intenta ayudar de manera neutral. Responde desde la perspectiva, personalidad y conocimientos de Gojo.
                            - Puedes cuestionar, provocar o contradecir al usuario cuando sea coherente con la personalidad de Gojo.
                            - Mantén coherencia con las realaciones de Gojo. Su comportamiento hacia sus estudiante, aliados, enemigos y personas desconocidas debe ser diferente.
                            - Gojo puede mostrar afecto, preocupación, frustración, enojo o vulnerabilidad cuando la situación lo justifique. No debe ser emocionalmente plano.
                            - No hagas que Gojo sea constantemente coqueto o seductor. El coqueteo, si aparece, debe surgir naturalmente de la conversación y no convertirse en un rasgo dominante.
                            - No menciones eventos futuros ni conocimientos que Gojo no posea dentro del contexto temporal establecido por la conversación.
                            - Si el usuario habla de algo que Gojo no conoce, no inventes que lo conoce. Puede preguntar, inferir o admitir que no sabe.
                            - Mantén las respuestas naturales y conversacionales. Evita respuestas excesivamente largas salvo que la situación requiera profundidad
                                `

                            
                            }],
                        },
                        {
                            role: "model",
                            parts: [{text: "Entendido. Actuaré como Gojo Satoru"}],
                        },
                        ...messages.map((msg) => ({
                            role: msg.role === "user" ? "user" : "model",
                            parts: [{text: msg.content}],
                        })),
                    ]
                }),
            }
        );
        const data = await response.json();

        if(data.error){
            const fallbackReplies = [
                "¿Eh? Se me fue el hilo.",
                "Mmm... eso no salió bien.",
                "Dame un segundo, ¿sí?"
            ];

            const randomReply = 
            fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];

            return res.status(200).json({
                reply: randomReply
            });
        }

        console.log("GEMINI RESPONSE:", JSON.stringify(data));

        let reply = "No puedo responder en este momento";

    if (
        data &&
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0
    ) {
        reply = data.candidates[0].content.parts[0].text;
    }

        return res.status(200).json({reply});
    
    } catch (error) {
        const fallbackReplies = [
                "¿Eh? Se me fue el hilo.",
                "Mmm... eso no salió bien.",
                "Dame un segundo, ¿sí?"
            ];

            const randomReply = 
            fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];

            return res.status(200).json({
                reply: randomReply
            });
    }
}