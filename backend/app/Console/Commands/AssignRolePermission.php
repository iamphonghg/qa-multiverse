<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;

class AssignRolePermission extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'exec:user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $permission1 = Permission::create(['name' => 'create_post']);
        $permission2 = Permission::create(['name' => 'vote']);
        $permission3 = Permission::create(['name' => 'edit_post']);
        $permission4 = Permission::create(['name' => 'answer']);
        $permission5 = Permission::create(['name' => 'comment']);

        $users = User::all();
        foreach ($users as $user) {
            $user->givePermissionTo([
                'create_post',
                'vote',
                'edit_post',
                'answer',
                'comment'
            ]);
        }
    }
}
