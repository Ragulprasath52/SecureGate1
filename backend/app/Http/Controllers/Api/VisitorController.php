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
            'photo' => 'nullable|string', // Could be base64
        ]);

        $visitor = Visitor::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'flat' => $validated['flat'],
            'purpose' => $validated['purpose'],
            'status' => 'waiting',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Visitor registered successfully.',
            'data' => [
                'requestId' => $visitor->id,
                'approvalLink' => url("/resident/approve/{$visitor->id}")
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
            'status' => 'required|in:approved,denied'
        ]);

        $visitor->update(['status' => $validated['status']]);

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
