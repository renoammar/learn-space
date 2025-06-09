<?php

namespace App\Http\Controllers;
use Illuminate\Routing\Controller as BaseController;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class SchoolController extends BaseController
{
    public function __construct()
    {
        // Remove the custom middleware function and use the auth middleware
        $this->middleware('auth');
    }

    public function create(): Response
    {
        if (Auth::user()->role !== 'principal') {
            abort(403, 'Hanya kepala sekolah yang dapat mengakses halaman ini.');
        }
        return Inertia::render('CreateSchool');
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        School::create([
            'name' => $request->name,
            'principal_id' => Auth::id(),
        ]);

        return redirect()->route('home')->with('success', 'Sekolah berhasil dibuat.');
    }
}
