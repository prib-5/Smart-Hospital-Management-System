/**
 * Sends an SMS message to the specified phone number.
 *
 * @param phoneNumber The recipient's phone number.
 * @param message The message to send.
 * @returns A promise that resolves when the SMS is sent successfully.
 */
export async function sendSms(phoneNumber: string, message: string): Promise<void> {
  // TODO: Implement this by calling an SMS API.
  console.log(`Sending SMS to ${phoneNumber}: ${message}`);
  return Promise.resolve();
}
