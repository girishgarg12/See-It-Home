<!DOCTYPE html>
<html>
<head>
    <title>Order Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px;">
    <h2>Hello {{ $user->name }},</h2>
    <p>Your order status has been updated to: <strong>{{ $order->status }}</strong></p>
    
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Order Details (ID: {{ $order->_id }})</h3>
        <p><strong>Total Amount:</strong> ₹{{ $order->total }}</p>
        <p><strong>Items:</strong></p>
        <ul>
            @foreach($order->items as $item)
                <li>{{ $item['name'] }} (x{{ $item['quantity'] }}) - ₹{{ $item['price'] }}</li>
            @endforeach
        </ul>
    </div>
    
    <p>Thank you for shopping with SeeItHome!</p>
</body>
</html>
