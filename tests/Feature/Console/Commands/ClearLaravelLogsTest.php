<?php

use Illuminate\Support\Facades\File;

it('clears laravel logs', function () {
    # Act & Assert
    $this->artisan('logs:clear')
        ->assertSuccessful()
        ->expectsOutput('Laravel logs have been cleared!')
        ->assertSuccessful();

    # Assert
    expect(File::size(storage_path('logs/laravel.log')))->toBe(0);
});
