/* eslint-disable no-useless-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../../../helper/AppError";
// import Anthropic from "@anthropic-ai/sdk"; // Assume this would be used in production

const getGiftSuggestions = async (prompt: string, userId: string) => {
    // In a real implementation, you would call Claude here
    // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // For MVP, we return a mock response that simulates AI logic
    // This could also be used to save the conversation in the database if a Chat model existed

    const mockSuggestions = [
        { title: "Sony WH-1000XM5", category: "NEED", reason: "Based on your interest in tech and focus." },
        { title: "Kindle Paperwhite", category: "WANT", reason: "Great for your reading hobby mentioned in bio." }
    ];

    return {
        reply: `Hi! Based on your profile, I suggest adding these to your Wishi list:`,
        suggestions: mockSuggestions
    };
};

export const AIServices = {
    getGiftSuggestions
};
