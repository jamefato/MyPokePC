<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Account extends Authenticatable
{
    // Update the created_at column name to match the database column
    const CREATED_AT = 'registered';
    // Disable the update_at colum as it doesn't exist in the database
    const UPDATED_AT = null;

    protected $table = 'accounts';
    protected $fillable = ['email', 'password'];
    protected $hidden = ['password', 'remember_token'];
}
