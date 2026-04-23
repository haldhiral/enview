<?php

namespace App\Services\EndView;

use App\Models\Company;
use App\Models\Device;
use App\Models\DeviceStatus;
use App\Models\Site;
use Illuminate\Http\Request;

class DeviceQueryService
{
    public function __construct(private readonly EndViewPresenter $presenter)
    {
    }

    public function indexData(Request $request): array
    {
        $filters = $this->filters($request);
        $query = Device::query()
            ->active()
            ->with(['company', 'site', 'currentUser', 'latestMetricSnapshot']);

        $this->applyFilters($query, $filters);
        $this->applySorting($query, $filters);

        return [
            'devices' => $query
                ->paginate(15)
                ->withQueryString()
                ->through(fn(Device $device) => $this->presenter->deviceListItem($device)),
            'filters' => $filters,
            'options' => $this->filterOptions(),
        ];
    }

    private function filters(Request $request): array
    {
        return [
            'search' => trim((string) $request->input('search', '')),
            'company_id' => $request->input('company_id'),
            'site_id' => $request->input('site_id'),
            'status_code' => $request->input('status_code'),
            'device_type' => $request->input('device_type'),
            'os_name' => $request->input('os_name'),
            'sort_by' => $request->input('sort_by', 'last_checkin_at'),
            'sort_direction' => strtolower((string) $request->input('sort_direction', 'desc')) === 'asc' ? 'asc' : 'desc',
        ];
    }

    private function applyFilters($query, array $filters): void
    {
        if ($filters['search'] !== '') {
            $search = $filters['search'];

            $query->where(function ($query) use ($search) {
                $query
                    ->where('trx_devices.hostname', 'like', "%{$search}%")
                    ->orWhere('trx_devices.device_name', 'like', "%{$search}%")
                    ->orWhere('trx_devices.serial_number', 'like', "%{$search}%")
                    ->orWhere('trx_devices.mac_address', 'like', "%{$search}%")
                    ->orWhere('trx_devices.ipv4_address', 'like', "%{$search}%")
                    ->orWhere('trx_devices.ipv6_address', 'like', "%{$search}%")
                    ->orWhere('trx_devices.last_logged_on_username', 'like', "%{$search}%");
            });
        }

        foreach ([
            'company_id' => 'company_id',
            'site_id' => 'site_id',
            'status_code' => 'current_status_code',
            'device_type' => 'device_type',
            'os_name' => 'os_name',
        ] as $filter => $column) {
            if ($filters[$filter] !== null && $filters[$filter] !== '') {
                $query->where("trx_devices.{$column}", $filters[$filter]);
            }
        }
    }

    private function applySorting($query, array $filters): void
    {
        $sortMap = [
            'device_name' => 'trx_devices.device_name',
            'hostname' => 'trx_devices.hostname',
            'company' => 'mst_companies.company_name',
            'site' => 'mst_sites.site_name',
            'device_type' => 'trx_devices.device_type',
            'os_name' => 'trx_devices.os_name',
            'status_code' => 'trx_devices.current_status_code',
            'health_score' => 'trx_devices.health_score',
            'last_checkin_at' => 'trx_devices.last_checkin_at',
        ];

        $sortBy = $filters['sort_by'];
        $sortColumn = $sortMap[$sortBy] ?? $sortMap['last_checkin_at'];

        if ($sortBy === 'company') {
            $query->leftJoin('mst_companies', 'mst_companies.id', '=', 'trx_devices.company_id');
        }

        if ($sortBy === 'site') {
            $query->leftJoin('mst_sites', 'mst_sites.id', '=', 'trx_devices.site_id');
        }

        $query
            ->select('trx_devices.*')
            ->orderBy($sortColumn, $filters['sort_direction'])
            ->orderBy('trx_devices.id');
    }

    private function filterOptions(): array
    {
        return [
            'companies' => Company::query()
                ->where('is_active', true)
                ->orderBy('company_name')
                ->get()
                ->map(fn(Company $company) => $this->presenter->option($company))
                ->values(),
            'sites' => Site::query()
                ->where('is_active', true)
                ->orderBy('site_name')
                ->get()
                ->map(fn(Site $site) => $this->presenter->option($site))
                ->values(),
            'statuses' => DeviceStatus::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
                ->map(fn(DeviceStatus $status) => $this->presenter->option($status))
                ->values(),
            'device_types' => Device::query()
                ->active()
                ->whereNotNull('device_type')
                ->distinct()
                ->orderBy('device_type')
                ->pluck('device_type')
                ->values(),
            'os_names' => Device::query()
                ->active()
                ->whereNotNull('os_name')
                ->distinct()
                ->orderBy('os_name')
                ->pluck('os_name')
                ->values(),
        ];
    }
}
