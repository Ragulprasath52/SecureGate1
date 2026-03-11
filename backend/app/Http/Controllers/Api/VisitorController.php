<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use Illuminate\Http\Request;

class VisitorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Visitor::latest()->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'flat' => 'required|string',
            'purpose' => 'required|string',
            'photo' => 'nullable|string',
            'resident_phone' => 'nullable|string',
        ]);

        $visitor = Visitor::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'flat' => $validated['flat'],
            'purpose' => $validated['purpose'],
            'status' => 'waiting',
        ]);

        $residentNumber = $request->resident_phone ?? '9345272947';
        $phoneNumberId = env('WHATSAPP_PHONE_ID', 'ID_HERE');
        $accessToken = env('WHATSAPP_TOKEN', 'TOKEN_HERE');
        
        $frontendUrl = "http://10.100.20.27:5173";
        $approvalLink = "{$frontendUrl}/resident/approve/{$visitor->id}";
        $message = "SecureGate Alert: A visitor {$visitor->name} for Flat {$visitor->flat} is at the gate. Please approve or reject here: {$approvalLink}";
        
        // Sending WhatsApp via Meta Cloud API
        try {
            $response = \Illuminate\Support\Facades\Http::withToken($accessToken)
                ->post("https://graph.facebook.com/v20.0/{$phoneNumberId}/messages", [
                    'messaging_product' => 'whatsapp',
                    'to' => '91' . $residentNumber,
                    'type' => 'text',
                    'text' => [
                        'body' => $message
                    ]
                ]);
            
            \Log::info("Meta Status: " . $response->status());
            \Log::info("Meta Response: " . $response->body());
           
            if ($response->successful()) {
                \Log::info("Meta WhatsApp: Successfully sent to {$residentNumber}");
            } else {
                \Log::error("Meta WhatsApp: Failed to send. Status: " . $response->status());
            }
        } catch (\Exception $e) {
            \Log::error("META WHATSAPP ERROR: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Visitor registered. Notification sent to resident.',
            'data' => [
                'requestId' => $visitor->id,
                'approvalLink' => $approvalLink
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Visitor $visitor)
    {
        return response()->json([
            'success' => true,
            'data' => $visitor
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Visitor $visitor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Visitor $visitor)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,denied',
            'rejection_reason' => 'nullable|string'
        ]);

        $visitor->update([
            'status' => $validated['status'],
            'rejection_reason' => $validated['rejection_reason'] ?? null
        ]);

        return response()->json([
            'success' => true,
            'message' => "Visitor status updated to {$validated['status']}."
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Visitor $visitor)
    {
        //
    }
}
