<?php
namespace App\Listeners;

use App\Events\OrderStatusUpdated;
use App\Mail\OrderStatusMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use App\Models\User;

class SendOrderStatusEmail implements ShouldQueue
{
    public function __construct()
    {
        //
    }

    public function handle(OrderStatusUpdated $event): void
    {
        $user = User::find($event->order->user_id);
        if ($user) {
            Mail::to($user->email)->send(
                new OrderStatusMail($event->order, $user)
            );
        }
    }
}
