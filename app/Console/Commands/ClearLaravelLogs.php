<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ClearLaravelLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'logs:clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clears down the laravel.log file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        exec('truncate -s 0 ' . storage_path('logs/laravel.log'));

        $this->comment('Laravel logs have been cleared!');
    }
}
