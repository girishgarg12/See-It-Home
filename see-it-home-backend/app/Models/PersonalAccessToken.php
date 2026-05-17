<?php
namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use MongoDB\Laravel\Eloquent\DocumentModel;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    use DocumentModel;

    protected $connection = 'mongodb';
    protected $collection = 'personal_access_tokens'; // MongoDB uses collections
    protected $primaryKey = '_id';
    protected $keyType = 'string';

    // Override the table property which might be used by Sanctum internally
    protected $table = 'personal_access_tokens';

    public function tokenable()
    {
        return $this->morphTo('tokenable');
    }
}
