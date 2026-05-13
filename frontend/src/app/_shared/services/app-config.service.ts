import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AppConfig {
  apiEstoqUrl?: string;
  apiReportsUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private config: AppConfig = {};

  constructor(private httpClient: HttpClient) { }

  get apiEstoqUrl(): string {
    return this.config.apiEstoqUrl || location.origin;
  }

  get apiReportsUrl(): string {
    return this.config.apiReportsUrl || '';
  }

  async load(): Promise<void> {
    if (!environment.production) {
      this.config = this.validate(environment);
      return;
    }

    try {
      const config = await firstValueFrom(
        this.httpClient.get<AppConfig>('assets/app-config.json')
      );

      this.config = this.validate(config);
    } catch (error: any) {
      if (error?.status !== 404) {
        throw new Error('Falha ao carregar assets/app-config.json.');
      }

      this.config = this.validate({});
    }
  }

  private validate(config: AppConfig): AppConfig {
    const apiEstoqUrl = config.apiEstoqUrl || environment.apiEstoqUrl || location.origin;

    if (!apiEstoqUrl) {
      throw new Error('Configuração inválida: "apiEstoqUrl" não foi definida.');
    }

    const apiReportsUrl = config.apiReportsUrl || (environment as any).apiReportsUrl;

    return { apiEstoqUrl, apiReportsUrl };
  }
}
