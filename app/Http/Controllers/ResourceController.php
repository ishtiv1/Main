<?php

// ResourceController.php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ResourceController extends Controller
{
    public function index()
    {
        return Inertia::render('Resources/Index', [
            'resources' => Resource::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate image
        ]);

        $imagePath = $request->file('image') ? $request->file('image')->store('images', 'public') : null;

        Resource::create([
            'name' => $request->name,
            'type' => $request->type,
            'description' => $request->description,
            'images' => $imagePath,
        ]);

        return redirect()->route('resources.index');
    }

    public function update(Request $request, Resource $resource)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($resource->images) {
                Storage::disk('public')->delete($resource->images);
            }
            $imagePath = $request->file('image')->store('images', 'public');
            $resource->images = $imagePath;
        }

        $resource->update($request->only('name', 'type', 'description'));

        return redirect()->route('resources.index');
    }

    public function destroy(Resource $resource)
    {
        $resource ->delete();

        return redirect()->route('resources.index');
    }
}

