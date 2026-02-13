import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    """Myntra-style filters: category, gender, brand, price range, discount, color, size."""
    category = django_filters.CharFilter(field_name='category__slug')
    gender = django_filters.CharFilter(field_name='gender')
    brand = django_filters.CharFilter(field_name='brand', lookup_expr='iexact')
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    min_discount = django_filters.NumberFilter(field_name='discount_percent', lookup_expr='gte')
    color = django_filters.CharFilter(field_name='variants__color', lookup_expr='iexact')
    size = django_filters.CharFilter(field_name='variants__size', lookup_expr='iexact')

    class Meta:
        model = Product
        fields = ['category', 'gender', 'brand', 'min_price', 'max_price', 'min_discount', 'color', 'size']
