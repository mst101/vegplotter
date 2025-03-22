<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlotRequest;
use App\Models\Plot;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class PlotController extends Controller
{
    use AuthorizesRequests;

//    public function index()
//    {
//        $this->authorize('viewAny', Plot::class);
//
//        return Plot::all();
//    }

    public function index()
    {
        $plots = Plot::where('user_id', auth()->user()->id)->first();

        return Inertia::render('PlotPage', compact('plots'));
    }

    public function store(PlotRequest $request)
    {
        $this->authorize('create', Plot::class);

        return Plot::create($request->validated());
    }

    public function show(Plot $plot)
    {
        $this->authorize('view', $plot);

        return $plot;
    }

//    public function update(PlotRequest $request, Plot $plot)
//    {
//        $this->authorize('update', $plot);
//
//        $plot->update($request->validated());
//
//        return $plot;
//    }

    public function update(Plot $plot, PlotRequest $request)
    {
        $attributes = $request->validated();
        $plot->update([
            ...$attributes,
            'user_id' => auth()->user()->id,
        ]);

        return Redirect::back()->with(['success' => 'Plot updated.', 'plots' => $plot]);
    }

    public function destroy(Plot $plot)
    {
        $this->authorize('delete', $plot);

        $plot->delete();

        return response()->json();
    }
}
