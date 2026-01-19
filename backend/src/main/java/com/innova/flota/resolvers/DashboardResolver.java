package com.innova.flota.resolvers;

import com.innova.flota.services.DashboardService;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class DashboardResolver {

    private final DashboardService dashboardService;

    public DashboardResolver(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @QueryMapping
    public Map<String, Object> dashboardStats() {
        return dashboardService.getDashboardStats();
    }
}
