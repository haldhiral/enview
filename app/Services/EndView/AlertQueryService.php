<?php

namespace App\Services\EndView;

use App\Models\Company;
use App\Models\DeviceAlert;
use App\Models\Site;
use Illuminate\Http\Request;

class AlertQueryService
{
    public function __construct(private readonly EndViewPresenter $presenter) {}

    public function indexData(Request $request): array
    {
        $filters = $this->filters($request);
        $query = DeviceAlert::query()->with(['device.company', 'device.site']);

        if ($filters['severity_code'] !== '') {
            $query->where('severity_code', $filters['severity_code']);
        }

        if ($filters['status_code'] !== '') {
            $query->where('status_code', $filters['status_code']);
        }

        if ($filters['company_id'] !== '') {
            $query->whereHas('device', fn ($query) => $query->where('company_id', $filters['company_id']));
        }

        if ($filters['site_id'] !== '') {
            $query->whereHas('device', fn ($query) => $query->where('site_id', $filters['site_id']));
        }

        if ($filters['date_from'] !== '') {
            $query->whereDate('opened_at', '>=', $filters['date_from']);
        }

        if ($filters['date_to'] !== '') {
            $query->whereDate('opened_at', '<=', $filters['date_to']);
        }

        return [
            'alerts' => $query
                ->latest('opened_at')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (DeviceAlert $alert) => $this->presenter->alert($alert)),
            'filters' => $filters,
            'options' => [
                'severity_codes' => ['INFO', 'WARNING', 'CRITICAL'],
                'status_codes' => ['OPEN', 'ACK', 'RESOLVED'],
                'companies' => Company::query()
                    ->where('is_active', true)
                    ->orderBy('company_name')
                    ->get()
                    ->map(fn (Company $company) => $this->presenter->option($company))
                    ->values(),
                'sites' => Site::query()
                    ->where('is_active', true)
                    ->orderBy('site_name')
                    ->get()
                    ->map(fn (Site $site) => $this->presenter->option($site))
                    ->values(),
            ],
        ];
    }

    private function filters(Request $request): array
    {
        return [
            'severity_code' => (string) $request->input('severity_code', ''),
            'status_code' => (string) $request->input('status_code', ''),
            'company_id' => (string) $request->input('company_id', ''),
            'site_id' => (string) $request->input('site_id', ''),
            'date_from' => (string) $request->input('date_from', ''),
            'date_to' => (string) $request->input('date_to', ''),
        ];
    }
}
