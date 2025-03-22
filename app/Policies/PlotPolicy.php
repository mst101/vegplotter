<?php

namespace App\Policies;

use App\Models\Plot;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PlotPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {

    }

    public function view(User $user, Plot $plotSettings): bool
    {
    }

    public function create(User $user): bool
    {
    }

    public function update(User $user, Plot $plotSettings): bool
    {
    }

    public function delete(User $user, Plot $plotSettings): bool
    {
    }

    public function restore(User $user, Plot $plotSettings): bool
    {
    }

    public function forceDelete(User $user, Plot $plotSettings): bool
    {
    }
}
