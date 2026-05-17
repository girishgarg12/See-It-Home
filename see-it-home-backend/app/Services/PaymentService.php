<?php
namespace App\Services;

/**
 * PaymentService handles payment gateway integration.
 * 
 * Currently uses simulated payment mode.
 * Replace with Razorpay, Stripe, or other gateway in production.
 */
class PaymentService
{
    /**
     * Process a payment for the given amount.
     *
     * @param float  $amount   Total amount to charge
     * @param array  $metadata Additional payment metadata
     * @return array Payment result with status and reference
     */
    public function processPayment(float $amount, array $metadata = []): array
    {
        // Simulated payment — always succeeds in development
        // In production, integrate with Razorpay/Stripe:
        //
        // $payment = \Razorpay\Api\Payment::create([
        //     'amount'   => $amount * 100, // paisa
        //     'currency' => 'INR',
        //     ...
        // ]);

        return [
            'status'    => 'paid',
            'reference' => 'SIM_' . strtoupper(bin2hex(random_bytes(8))),
            'amount'    => $amount,
            'gateway'   => 'simulated',
        ];
    }

    /**
     * Process a refund for the given payment reference.
     *
     * @param string $paymentReference Original payment reference
     * @param float  $amount           Amount to refund
     * @return array Refund result
     */
    public function processRefund(string $paymentReference, float $amount): array
    {
        return [
            'status'    => 'refunded',
            'reference' => 'REF_' . strtoupper(bin2hex(random_bytes(8))),
            'amount'    => $amount,
        ];
    }
}
