<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlotRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['required', 'exists:plots'],
            'user_id' => ['required', 'exists:users,id'],
            'name' => ['required', 'max:100'],
            'width' => ['required', 'numeric'],
            'length' => ['required', 'numeric'],
            'location_lat' => ['required', 'numeric'],
            'location_lng' => ['required', 'numeric'],
            'location_name' => ['required', 'string'],
            'units' => ['required', 'string'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
