<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $today = now()->startOfDay();
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_today' => Visitor::where('created_at', '>=', $today)->count(),
                'waiting' => Visitor::where('status', 'waiting')->count(),
                'approved' => Visitor::where('status', 'approved')->where('created_at', '>=', $today)->count(),
                'rejected' => Visitor::where('status', 'denied')->where('created_at', '>=', $today)->count(),
            ]
        ]);
    }
}
